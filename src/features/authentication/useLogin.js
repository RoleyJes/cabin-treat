import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending, mutate: login } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),

    // on the onSuccess handler, we can get the data that was received from the fn as an input
    onSuccess: (user) => {
      console.log(user);

      // This allows us to manually set some data into the react query cache. Here, we're setting the user immediately after login so that the user data will not be fetched again using useUser. RQ will immediately see it in the cache and load the user data from there, and only use useUser when it isn't the case of an immediate log in. This is possiblr because of the queryKey which is the same "user"
      queryClient.setQueryData(["user"], user.user);
      navigate("/dashboard", { replace: true });
    },

    onError: (err) => {
      console.log("Error", err);
      toast.error("Provided email or password are incorrect");
    },
  });

  return { login, isPending };
}
