import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerPage = () => {
  return (
    <div>
      <SwaggerUI url="http://26.139.159.129:5000/swagger/v1/swagger.json" />
    </div>
  );
};

export default SwaggerPage;
