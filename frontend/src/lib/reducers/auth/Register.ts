/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// Define data types for user registration
interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  profilePicture?: File; // Keep this as optional
  bio?: string;          // Mark as optional since it may not be provided
}

// Define the expected structure of the registration response
interface RegistrationResponse {
  success: boolean;
  message: string;
  // Add other fields based on your API response
  // e.g., user: User; (if applicable)
}

// Function to handle profile picture upload
export const uploadProfilePicture = async (profilePicture: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', profilePicture);

  try {
    const response = await axios.post('http://localhost:3000/api/upload/upload-single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Uploaded Profile Picture URL:", response.data.url);
    return response.data.url; // Return the uploaded file's URL
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('File upload error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Profile picture upload failed');
  }
};

// Function to handle registration
export const register = async (registerData: RegisterData): Promise<RegistrationResponse> => {
  let profilePictureUrl: string | undefined; // Make this undefined by default

  // Upload profile picture if provided
  if (registerData.profilePicture) {
    try {
      profilePictureUrl = await uploadProfilePicture(registerData.profilePicture);
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unexpected error during profile picture upload');
      throw new Error('Error uploading profile picture');
    }
  }

  // Prepare the payload for registration
  const registrationPayload = {
    email: registerData.email,
    password: registerData.password,
    username: registerData.username,
    fullName: registerData.fullName,
    phone: registerData.phone,
    address: registerData.address,
    role: registerData.role,
    bio: registerData.bio || '',  // Use an empty string if bio is not provided
    profilePicture: profilePictureUrl || undefined, // Add the uploaded profile picture URL or undefined if not available
  };

  try {
    const response = await axios.post<RegistrationResponse>('http://localhost:3000/api/auth/register', registrationPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return response data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Registration error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error during registration:', error);
    }
    throw new Error('Registration failed');
  }
};
