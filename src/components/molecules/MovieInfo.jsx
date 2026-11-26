
import Title from '../atoms/Title'
import Rating from '../atoms/Rating'
import '../../styles/molecules/movie-info.css'

function MovieInfo({ title, score, year, duration }) {
  return (
    <div className="card-content">
      <Title>{title}</Title>

      <Rating
        score={score}
        year={year}
        duration={duration}
      />
    </div>
  )
}

export default MovieInfo
