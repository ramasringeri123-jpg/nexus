import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Students(){

  const [students,setStudents] = useState([]);
  const [filtered,setFiltered] = useState([]);

  const [username,setUsername] = useState("");
  const [country,setCountry] = useState("");
  const [state,setState] = useState("");

  useEffect(()=>{

    const loadUsers = async()=>{

      const snap = await getDocs(collection(db,"users"));

      const arr=[];

      snap.forEach(doc=>{
        arr.push({
          id:doc.id,
          ...doc.data()
        });
      });

      setStudents(arr);
      setFiltered(arr);

    };

    loadUsers();

  },[]);


  const search = ()=>{

    const result = students.filter(user=>{

      return (
        (username === "" || user.username?.toLowerCase().includes(username.toLowerCase())) &&
        (country === "" || user.country?.toLowerCase().includes(country.toLowerCase())) &&
        (state === "" || user.state?.toLowerCase().includes(state.toLowerCase()))
      );

    });

    setFiltered(result);

  };


  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Search Students
      </h1>

      {/* SEARCH BAR */}

      <div className="flex gap-3 mb-6">

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="bg-[#0f172a] p-3 rounded"
        />

        <input
          placeholder="Country"
          value={country}
          onChange={(e)=>setCountry(e.target.value)}
          className="bg-[#0f172a] p-3 rounded"
        />

        <input
          placeholder="State (optional)"
          value={state}
          onChange={(e)=>setState(e.target.value)}
          className="bg-[#0f172a] p-3 rounded"
        />

        <button
          onClick={search}
          className="bg-purple-600 px-4 rounded"
        >
          Search
        </button>

      </div>

      {/* RESULTS */}

      {filtered.length === 0 && (
        <p className="text-gray-400">
          No users found
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {filtered.map(user=>(

          <div
            key={user.id}
            className="bg-[#0f172a] p-6 rounded-xl"
          >

            <div className="flex items-center gap-3 mb-2">

              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                className="w-10 h-10 rounded-full"
              />

              <div>

                <h2 className="font-semibold">
                  {user.displayName}
                </h2>

                <p className="text-gray-400">
                  @{user.username}
                </p>

              </div>

            </div>

            <p className="text-sm text-gray-400">
              {user.state}, {user.country}
            </p>

            <button className="mt-3 bg-purple-600 px-3 py-1 rounded">
              Connect
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}