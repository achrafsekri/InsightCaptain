import { useUser } from "../../auth/UserContext";
import Navbar from "./Navbar";

export default function Nav() {
  const user = useUser();
  return <Navbar user={user.user} />;
}
