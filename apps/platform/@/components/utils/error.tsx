import Image from 'next/image';
import ErrorImg from "./asset/error.png";

export default function ErrorBanner() {
    return (
        <div className="flex items-center justify-center w-full h-full max-h-96 bg-red-100 border border-red-500">
            <Image src={ErrorImg} alt="Error" height={512} width={512}  className='mx-auto size-80'/>
            <h1 className="text-2xl font-semibold text-gray-700 text-center">Something went wrong!</h1>
            <p className="text-md text-gray-500 text-center">We are sorry, but something went wrong. Please try again later.</p>
        </div>
    );
}