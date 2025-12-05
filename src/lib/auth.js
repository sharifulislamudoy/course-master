import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }
  
  try {
    // Fetch additional user data from your backend if needed
    const response = await fetch("http://localhost:5000/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    
    return session.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return session.user;
  }
}