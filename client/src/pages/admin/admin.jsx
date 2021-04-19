import React from 'react';
import PropTypes from 'prop-types';

import { isAdmin } from 'auth';
import NotFound from 'pages/404';

const auth = useAuth();
console.log(useAuth());  

export default function ProtectedAdminRoute({ blocked }) {
    return blocked ? <NotFound /> : (
      <div></div>
    );
  }
  ProtectedAdminRoute.propTypes = {
    blocked: PropTypes.bool.isRequired,
  };
  
  export function getServerSideProps(ctx) {
    const blocked = !isAdmin(ctx);
    if (blocked) ctx.res.statusCode = 404;
    return { props: { blocked } };
  }