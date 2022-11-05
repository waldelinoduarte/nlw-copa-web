import Image from "next/image";
import { FormEvent, useState } from "react";

import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import iconCheckImg from '../assets/iconChecked.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/user-avatares.png';
import { api } from "../lib/axios";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usesCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      
      alert('Bolão criado com sucesso, o código - '+ code + ' - foi copiado para a área de transferência! ');
      setPoolTitle('');

    } catch (err) {
      console.log(err);
      alert('Falha ao criar o bolão, tente novamente!');
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center ">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl gap-2">
              <span className="text-ignite-500">+{props.usesCount} </span>
              pessoas já estão usando
          </strong>
        </div> 

        <form 
          action=""
          className="mt-10 flex gap-2"
          onSubmit={createPool}
        >
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold uppercase text-sm hover:bg-yellow-700 transition-colors"
            type="submit"
          >
            Criar meu bolão
          </button>

        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div
          className="mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 grid grid-cols-2 text-gray-100"
        >
          <div className="flex items-center gap-6 justify-start">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 justify-end">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>

      </main>
      <Image 
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  )
}


export const getServerSideProps = async () => {
  const [
    poolCountResponse, 
    guessCountResponse,
    usesCountResponse,
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usesCount: usesCountResponse.data.count,
    }
  }
}