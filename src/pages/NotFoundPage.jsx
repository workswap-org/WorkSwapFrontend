import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {

    const navigate = useNavigate();

    return (
        <div className="body-center">
            <div className='card' style={{height: 'fit-content'}}>
                <div className='card-body'>
                    <h1>Страница не найдена</h1>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">⬅ Назад</button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;