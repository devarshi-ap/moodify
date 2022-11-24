import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { BiAnalyse } from "react-icons/bi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const Home: NextPage = () => {
	const CLIENT_ID = "b9ee931ca36b4541bb149a76b2b4e9a2";
	const REDIRECT_URI = "http://localhost:3000/";
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "token";

	// access token state
	const [token, setToken] = useState("");
	const [searchKey, setSearchKey] = useState("")
	const [artists, setArtists] = useState<any[]>([])

	useEffect(() => {
		// parse access_token value from redirected url after auth

		const hash: string = window.location.hash; // url hash
		let hash_token = window.localStorage.getItem("token") || ""; // localstorage hash
		
		if (!hash_token && hash) {
			// if hash not in localstorage, set it
			hash_token = hash.substring(1).split("&").find(el => el.startsWith("access_token"))?.split("=")[1] || "";  // parse URL for access_token=val
			
			window.location.hash = ""; // clear the url to hide the hash
			window.localStorage.setItem("token", hash_token); // set localstorage
			setToken(hash_token) // update state
		}
		// if hash in localstorage, get it & update state
		setToken(hash_token) // update state
	}, [token]);

	const logout = () => {
		setToken("");
		window.localStorage.removeItem("token");
		console.log("hi")
	}

	const searchArtists = async (e: React.FormEvent) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
		console.log(data);
        setArtists(data.artists.items)
    }

	const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id} className="my-3 border p-4 rounded w-fit">
                {artist.images.length ? <img width="30%" className="mx-auto rounded-full" src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                <p className="text-white underline mx-auto w-fit">{artist.name}</p>
            </div>
        ))
    }

	return (
		<motion.div
			initial={{ y: "10%", opacity: 0.1, scale: 1 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, ease: "easeIn" }}
			exit={{ opacity: 0 }}
		>
			<Head>
				<title>Moodify</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#1c053c] to-[#15162c]">
				<>
					{/* TITLE */}
					<div className="mt-[10rem] mb-[5rem] grid items-start justify-center gap-8">
						<div className="group relative">
							<div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
							<button className="relative flex items-center divide-x divide-gray-600 rounded-lg bg-black p-5 text-6xl">
								<span className="px-4">
									<BiAnalyse className="inline animate-spin-slow text-pink-600" />
								</span>
								<span className="px-4 font-mono font-bold text-gray-100">
									Moodify
								</span>
							</button>
						</div>
					</div>

					{console.log('token', token)}

					{/* LOGIN/LOGOUT BUTTON */}
					{!token ?
						<a
							href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
							className="text-white underline"
						>
							Login to Spotify
						</a>
						: <button onClick={logout} className="bg-white rounded p-2">Logout</button>}

					{token ?
						<form className="my-5" onSubmit={searchArtists}>
							<input className="rounded border" type="text" onChange={e => setSearchKey(e.target.value)}/>
							<button type={"submit"} className="bg-gray-600 ml-2 rounded border px-3">Search</button>
						</form>
						: <h2 className="text-white underline">Please Login</h2>
					}

					{renderArtists()}
				</>
			</main>
		</motion.div>
	);
};

export default Home;
