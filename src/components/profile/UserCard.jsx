import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/registration");
            return;
        }

        fetch("https://b2b.printgrad.ru/api/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Ошибка получения данных");
                }
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => {
                console.error(err);
                toast.error("Не удалось загрузить профиль");
                navigate("/registration");
            });
    }, [navigate]);

    return (
        <div>
            <h2>Профиль</h2>
            {user ? (
                <UserCard user={user} />
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );
}
