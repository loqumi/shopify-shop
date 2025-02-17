import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {
  CUSTOMER_METAFIELD_UPDATE,
  CUSTOMER_UPDATE_MUTATION,
} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import PrevRouteButton from '~/ui/PrevRouteButton';
import Input from '~/ui/Input';
import Button from '~/ui/Button';
import {useState} from 'react';
import {Checkbox} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/16/solid';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  return json({customer: data.customer});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    // getting customer id
    const {data: customerData} = await customerAccount.query(
      CUSTOMER_DETAILS_QUERY,
    );

    const customerId = customerData?.customer?.id;
    if (!customerId) {
      throw new Error('Could not get customer ID');
    }

    // name and surname set
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    const birthday = form.get('birthday');
    const city = form.get('city');
    const phone = form.get('phone');

    if (
      (birthday && typeof birthday === 'string') ||
      (city && typeof city === 'string') ||
      (phone && typeof phone === 'string')
    ) {
      const {data: metafieldData, errors: metafieldErrors} =
        await customerAccount.mutate(CUSTOMER_METAFIELD_UPDATE, {
          variables: {
            metafields: [
              {
                key: 'birth_date',
                namespace: 'facts',
                ownerId: customerId,
                value: birthday,
              },
              {
                key: 'city',
                namespace: 'facts',
                ownerId: customerId,
                value: city,
              },
              {
                key: 'phone',
                namespace: 'facts',
                ownerId: customerId,
                value: phone,
              },
            ],
          },
        });

      if (metafieldErrors?.length) {
        throw new Error(metafieldErrors[0].message);
      }

      if (!metafieldData?.metafieldsSet?.metafields) {
        throw new Error('Customer profile update failed.');
      }
    }

    return json({
      error: null,
      customer: data?.customerUpdate?.customer,
    });
  } catch (error: any) {
    return json(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const {customer} = useLoaderData<typeof loader>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const [hasConcent, setHasConcent] = useState(false);
  const customerMetafields = useOutletContext();

  return (
    <div className="account-profile bg-main-pink px-4 lg:px-[10%] pb-14">
      <PrevRouteButton title="cabinet" to="/account" />

      <h1 className="!pt-6 !m-0 !font-black !text-2xl font-fraunces">
        my profile
      </h1>

      <p className="font-normal text-sm !my-8 font-noto">
        There are{' '}
        <span className="text-dark-pink-two">3 mandatory fields </span>
        left to fill out
      </p>

      <Form method="PUT" className="flex flex-col">
        <legend className="!mb-6 font-semibold text-lg font-noto">
          Personal Info
        </legend>
        <fieldset className="!p-0 gap-7">
          <Input
            required
            placeholder="Surname"
            name="lastName"
            type="text"
            defaultValue={customer.lastName ?? ''}
          />
          <Input
            required
            placeholder="Name"
            name="firstName"
            type="text"
            defaultValue={customer.firstName ?? ''}
          />

          <h1 className="!mt-6 !font-semibold !text-lg font-noto">
            Date of birth
          </h1>
          <Input
            required
            placeholder="Birthday"
            name="birthday"
            type="date"
            defaultValue={customerMetafields.birth_date ?? ''}
            className={
              customerMetafields.birth_date ? '' : '!text-main-gray uppercase'
            }
          />

          <h1 className="!mt-6 !font-semibold !text-lg font-noto">City</h1>
          <Input
            required
            placeholder="City"
            name="city"
            type="phone"
            defaultValue={customerMetafields.city ?? ''}
          />

          <h1 className="!mt-6 !font-semibold !text-lg font-noto">
            Phone number
          </h1>
          <Input
            required
            placeholder="Phone number"
            name="phone"
            type="tel"
            defaultValue={customerMetafields.phone ?? ''}
          />
        </fieldset>
        {action?.error ? (
          <p>
            <mark>
              <small>{action.error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}

        <div className="flex gap-5 items-center mb-14 mt-8">
          <Checkbox
            checked={hasConcent}
            onChange={() => setHasConcent(!hasConcent)}
            className="group block size-6 min-w-6 rounded bg-white data-[checked]:bg-blue-500"
          >
            <CheckIcon className="hidden size-6 fill-black group-data-[checked]:block" />
          </Checkbox>
          <p className="font-noto">
            I consent to the processing of personal data in accordance with the
            privacy policy
          </p>
        </div>

        <Button
          title={state !== 'idle' ? 'Saving' : 'Save'}
          type="submit"
          disabled={state !== 'idle' || !hasConcent}
        />
      </Form>
    </div>
  );
}
