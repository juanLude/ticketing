import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const appProps = await AppComponent.getInitialProps(appContext);
  return { ...appProps };
};
export default AppComponent;
