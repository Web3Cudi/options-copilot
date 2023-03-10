import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Image from "next/image";

import useAuth from "@/hooks/useAuth";

interface Inputs {
  email: string;
  password: string;
  confirm?: string;
}

interface Props {
  toggleAuth: () => void;
}

export const LoginUI = ({ toggleAuth }: Props) => {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    await signIn(email, password);
  };
  return (
    <div className="flex-1 h-screen bg-slate-900 ">
      <div className="h-full flex flex-col justify-center items-center space-y-5">
        <div className="flex flex-row items-center space-x-3">
          <Image
            layout="intrinsic"
            src="/steam-icon.svg"
            height={75}
            width={75}
            alt="Icons by Icons8"
          />
          <h3 className="text-white text-2xl font-bold">Options Co-Pilot</h3>
        </div>
        <h1 className="text-white text-xl font-semibold">
          Sign in to your account
        </h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered max-w-xs text-white bg-gray-800/50 placeholder-white focus:input-success  
            w-72 md:w-full"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="p-1 text-[13px] font-light  text-orange-500">
              Please enter a valid email.
            </span>
          )}{" "}
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered max-w-xs text-white bg-gray-800/50 placeholder-white focus:input-success
            w-72 md:w-full"
            name="password"
            {...register("password", {
              required: "You must specify a password",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="p-1 text-[13px] font-light  text-orange-500">
              {errors.password.message}
            </p>
          )}
          <button
            className="btn btn-outline btn-success w-72 md:w-80"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <p className="text-white font-bold">or</p>
        <button
          onClick={() => toggleAuth()}
          className="btn btn-outline btn-secondary w-72 md:w-80"
        >
          Register
        </button>
      </div>
    </div>
  );
};
