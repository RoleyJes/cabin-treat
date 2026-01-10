import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  // !. Load the authenticated user
  const { isPending, user } = useUser();

  // 2. While loading, show spinner
  if (isPending)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 3. If NO authenticated user, redirect to the /login

  // 4. If user, render the app

  return children;
}

export default ProtectedRoute;
