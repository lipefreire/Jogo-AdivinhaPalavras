import  './GameOver.css'

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h1>Fim de Jogo!</h1>
      <h2>Você ganhou: <span>R$ {score},00</span></h2>
      <button onClick={retry}>Resetar Jogo</button>
    </div>
  )
}

export default GameOver