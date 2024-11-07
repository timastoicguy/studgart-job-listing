import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
  message: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  message: null,
  error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, thunkAPI) => {
      try {
        const response = await fakeLoginApi(credentials);
        return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Log the error or handle it properly
        return thunkAPI.rejectWithValue('Login failed');
      }
    }
  );
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      clearMessages: (state) => {
        state.message = null;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.user = action.payload;
        state.message = 'Login successful';
      });
      builder.addCase(login.rejected, (state) => {
        state.error = 'Login failed'; // action is not needed here
      });
    },
  });
  

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;

// Fake API call simulation
const fakeLoginApi = async (credentials: { email: string; password: string }) => {
  return new Promise<{ data: string }>((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        resolve({ data: 'token' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};
