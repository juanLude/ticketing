import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h1>Signing you out...</h1>
    </div>
  );
};
