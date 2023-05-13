import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'
import { useAppContext } from '../context/appContext';

const Landing = () => {
  const { user } = useAppContext();
  return (
    <React.Fragment>
      {user && <Navigate to='/' />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className='container page'>
          <div className='info'>

            <h1>
              job <span>tracking</span> App
            </h1>

            <p>
              I'm baby raclette prism paleo, tote bag lo-fi same farm-to-table asymmetrical yuccie fam. Kickstarter readymade man bun, sartorial poke gorpcore vibecession ascot bicycle rights YOLO photo booth 3 wolf moon big mood literally.
            </p>

            <Link to="/register" className='btn btn-hero'>
              Login/Register
            </Link>
          </div>

          <img src={main} alt="job hunt" className='img main-img' />
        </div>
      </Wrapper>
    </React.Fragment>
  )
}

export default Landing
