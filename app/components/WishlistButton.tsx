import {NavLink} from '@remix-run/react';
import {useContext} from 'react';
import {WishlistContext, type WishlistContextType} from '~/lib/WishlistContext';
import NotificationBadge from '~/ui/NotificationBadge';
import {useSearchModal} from '~/components/SearchModal';

export default function WishlistButton() {
  const {wishlistItems} = useContext(WishlistContext) as WishlistContextType;
  const {close} = useSearchModal();

  return (
    <NavLink
      className="flex items-center gap-1"
      to="/account/favorites"
      onClick={close}
    >
      <img src="/fav-icon.svg" alt="fav-icon" />
      <NotificationBadge notifications={wishlistItems.length} />
    </NavLink>
  );
}
