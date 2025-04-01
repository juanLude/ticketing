const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Home</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // we are on the server hence requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    const { data } = await axios.get(
      // this is the host name of the ingress controller
      // httpSERVICENAME.NAMESPACE.svc.cluster.local
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          Host: "ticketing.dev",
        },
      } // this is the host name of the ingress controller
    );
  } else {
    // we are on the browser
    // requests can be made with a base url of ''
    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }
  // left at video 22 min 3:00
  return {};
};
export default LandingPage;
