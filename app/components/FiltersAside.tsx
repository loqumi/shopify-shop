import {Aside} from './Aside';
import {FiltersMain} from './FiltersMain';

interface FiltersAsideProps {
  vendors: string[];
  productTypes: string[];
  maxPrice: {amount: string; currencyCode: string};
}

export default function FiltersAside({
  vendors,
  productTypes,
  maxPrice,
}: FiltersAsideProps) {
  return (
    <Aside type="filters" heading="filters">
      <FiltersMain
        maxPrice={maxPrice}
        vendors={vendors}
        productTypes={productTypes}
      />
    </Aside>
  );
}
