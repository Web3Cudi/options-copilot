import { useState } from "react";

import Image from "next/image";

import { LoginUI } from "@/features/auth/components/LoginUI";
import { SignUpUI } from "@/features/auth/components/SignUpUI";

const Login = () => {
  const [toggleSignUp, setToggleSignUp] = useState(false);
  const iconList = [
    {
      name: "React",
      logo: "/react-icon.svg",
      link: "https://reactjs.org/",
    },
    {
      name: "Typescript",
      logo: "/typescript-icon.svg",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "TailwindCSS",
      logo: "/tailwind-icon.svg",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Supabase",
      logo: "/supabase-icon.svg",
      link: "https://supabase.com/",
    },
  ];

  return (
    <div className="h-screen flex">
      <div className="relative  flex-1 flex-col bg-indigo-900 justify-center items-center hidden md:flex ">
        <img
          className="w-[50rem] h-[40rem] z-30"
          src="https://sso.ftmo.com/auth/resources/wy13c/login/ftmo/static/svg/default/login_hero.svg"
          alt=""
        />
        <div className="absolute bottom-56 bg-slate-700 w-full h-24 z-20" />
        <div className="flex flex-row absolute bottom-0 bg-slate-800 w-full h-56 z-20 space-x-9 justify-evenly items-start pt-16">
          {iconList.map((icon) => (
            <div
              key={icon.name}
              className="flex-col xl:flex-row flex items-center space-x-2 text-white w-10 xl:w-28"
            >
              <a href={icon.link} target="_blank">
                <div className="bg-slate-500/50 rounded-full w-16 h-16 p-2 overflow-hidden">
                  <Image
                    layout="responsive"
                    priority
                    src={icon.logo}
                    height={40}
                    width={40}
                    alt="Icons by Icons8"
                  />
                </div>
              </a>
              <p>{icon.name}</p>
            </div>
          ))}
        </div>
      </div>
      {toggleSignUp ? (
        <SignUpUI toggleAuth={() => setToggleSignUp(!toggleSignUp)} />
      ) : (
        <LoginUI toggleAuth={() => setToggleSignUp(!toggleSignUp)} />
      )}
    </div>
  );
};

export default Login;
