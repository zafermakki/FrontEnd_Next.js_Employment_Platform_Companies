"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Profile {
  id: number;
  user: User;
  full_name: string;
  bio: string;
  phone: string;
  address: string;
  profile_image: string | null;
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/profile/list/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (Array.isArray(data)) {
          setProfiles(data);
        } else {
          console.error("Unexpected response:", data);
          setProfiles([]); 
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSendMessage = async (profile: Profile) => {
    const { value: formValues } = await Swal.fire({
      title: `📩 Send a message to ${profile.full_name}`,
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Message subject (optional)">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Write your message here"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const subject = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const content = (document.getElementById("swal-input2") as HTMLTextAreaElement).value;
        if (!content) {
          Swal.showValidationMessage("Please enter your message!");
        }
        return { subject, content };
      },
    });

    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/profile/messages/send/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            receiver: profile.user.id, // Send receiver's user ID
            subject: formValues.subject,
            content: formValues.content,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire("✅ Sent!", "Your message was sent successfully.", "success");
        } else {
          Swal.fire("❌ Error", data.error || "An error occurred while sending the message.", "error");
        }
      } catch (error) {
        Swal.fire("❌ Error", "Failed to connect to the server.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-blue-600 font-semibold">
        Loading profiles...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Available Profiles
      </h3>

      {profiles.length === 0 ? (
        <p className="text-center text-gray-500">No profiles available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleSendMessage(profile)}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition duration-300"
            >
              <img
                src={
                  profile.profile_image
                    ? profile.profile_image
                    : "/default-avatar.png"
                }
                alt={profile.full_name}
                className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-800 text-center">
                {profile.full_name}
              </h4>
              <div className="w-full flex justify-center">
                <p
                  className="text-sm text-gray-600 text-center mb-2 break-words max-w-[90%]"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  {profile.user.email}
                </p>
              </div>
              <p className="text-gray-700 text-center mb-3 line-clamp-2">
                {profile.bio || "No bio provided"}
              </p>
              <p className="text-gray-700 text-center mb-3 line-clamp-2">
                {profile.address || "No bio provided"}
              </p>
              <p className="text-sm text-center text-blue-700 font-medium">
                📞 {profile.phone || "No phone"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}