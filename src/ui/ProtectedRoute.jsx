import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // !. Load the authenticated user
  const { isPending, isAuthenticated } = useUser();

  // 2. If NO authenticated user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isPending) navigate("/login");
    },
    [isAuthenticated, isPending, navigate],
  );

  // 3. While loading, show spinner
  if (isPending)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
