import React from 'react'
import { Link } from 'react-router'

const GettingStarted = () => <div>
    <h1 className="started__title">Getting Started</h1><br/>
    <h3 className="started__subtitle">Keen safety is a multi-platform software system available on both:</h3><br/>
    <div className="started__device">
        <div>
            <b className="started__device-title">1.Website</b>
            <img src="../assets/images/started-website.jpg" />
        </div>
        <div>
            <b className="started__device-title">2.App</b>
            <img src="../assets/images/started-app.jpg" />
        </div>
    </div>
    <div className="started__info">
        <p>For Keen Safety to work you will need both platforms.</p>
        <p>Our apps are available for download at any time, however, to use app you must first create account on the website.</p>
        <p>You can download our apps </p>
        <p>If you have any questions please feel to contact us.</p>
    </div>

    <div className="started__btn">
        <Link to={'/auth/signup'} className="content-section__btn-orange">{kst('Sign Up')}</Link>
        <Link to={'/contact'} className="content-section__btn">{kst('Contact Us')}</Link>
    </div>
</div>

export default GettingStarted