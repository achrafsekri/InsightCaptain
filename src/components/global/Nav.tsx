import { useUser } from "../../auth/UserContext";
import Navbar from "./Navbar";
import { getServerSession } from "next-auth/next";

export default function Nav() {
  const user = useUser();
  return <Navbar user={user} />;
}
