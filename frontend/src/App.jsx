function App(){
    const restaurantName = 'Lemon Grass'
    const tablesAvaiable = 5
    return(
        <div className='app-container'>
            <h1>{restaurantName}</h1>
            <p>Avaiable tables right now: {tablesAvaiable}</p>
            <input type='text' placeholder='Search menu..'/>
        </div>
    )
}

export default App