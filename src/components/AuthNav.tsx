// "use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function AuthNav() {
//   const router = useRouter();
//   const isAuth = isAuthenticated();

//   const handleLogout = () => {
//     try {
//       logout();
//       console.log("Logout successful");
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div className="flex gap-4 items-center">
//       {isAuth ? (
//         <>
//           <Button variant="destructive" onClick={handleLogout}>
//             Logout
//           </Button>
//         </>
//       ) : (
//         <>
//           <Button asChild variant="outline">
//             <Link href="/login">Login</Link>
//           </Button>
//           <Button asChild variant="outline">
//             <Link href="/signup">Sign Up</Link>
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }
