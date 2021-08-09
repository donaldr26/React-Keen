import React from 'react'
import PropTypes from 'prop-types'
import {Link, hashHistory} from 'react-router'
import {Grid, Row, Col, Button, Carousel} from 'react-bootstrap'

const MyCarousel2 = ({items}) => (
	<div className="carousel slide custom-carousel" id="myCarousel">
		<ol className="carousel-indicators">
			<li className="active"></li>
			<li></li>
			<li></li>
		</ol>
		<div className="carousel-inner">
			<div className="item active">
				<div className="col-xs-4">
					<a href="#">
						<img src="assets/images/not-logged-in/slide-1.png" className="img-responsive" />
					</a>
				</div>
			</div>
			<div className="item">
				<div className="col-xs-4">
					<a href="#">
						<img src="assets/images/not-logged-in/slide-2.png" className="img-responsive" />
					</a>
				</div>
			</div>
			<div className="item">
				<div className="col-xs-4">
					<a href="#">
						<img src="assets/images/not-logged-in/slide-3.png" className="img-responsive" />
					</a>
				</div>
			</div>
		</div>
		<a className="left carousel-control" href="#myCarousel" data-slide="prev">
			<i className="glyphicon glyphicon-chevron-left carousel-chevron"></i>
		</a>
		<a className="right carousel-control" href="#myCarousel" data-slide="next">
			<i className="glyphicon glyphicon-chevron-right carousel-chevron"></i>
		</a>
	</div>
)

const ITEMS = [
	{
		img: 'assets/images/not-logged-in/slide-1.png',
		alt: 'Slide 1'
	},
	{
		img: 'assets/images/not-logged-in/slide-2.png',
		alt: 'Slide 2'
	},
	{
		img: 'assets/images/not-logged-in/slide-3.png',
		alt: 'Slide 3'
	}
]

export default class NotLoggedinLayout extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		$('#myCarousel').carousel({
			interval: 10000
		})

		$('.carousel .item').each(function () {
			var next = $(this).next();
			if (!next.length) {
				next = $(this).siblings(':first');
			}
			next.children(':first-child').clone().appendTo($(this));
			if (next.next().length > 0) {
				next.next().children(':first-child').clone().appendTo($(this));
			} else {
				$(this).siblings(':first').children(':first-child').clone().appendTo($(this));
			}
		});

	}

	render() {
		return (
			<div id="not-loggedin-layout">
				<header className="header">
					<nav className="navbar navbar-default main-navbar">
						<div className="container-fluid header-section">
							<div className="navbar-header">
								<a href="#" className="navbar-brand navbar-logo">
									<img className="inline-block" src="/assets/images/not-logged-in/logo.png"/>
									<img className="inline-block" src="/assets/images/not-logged-in/site-name.png"/>
								</a>
								<div className="navbar-buttons">
									<button type="button" data-toggle="collapse" data-target=".navbar-collapse"
											className="navbar-toggle navbar-btn">Menu<i
										className="fa fa-align-justify"></i></button>
								</div>
							</div>
							<div id="navigation" className="collapse navbar-collapse navbar-right top-menu">
								<ul className="nav navbar-nav">
									<li><a href="#about" className="link-scroll">{kst('HOME')}</a></li>
									<li><a href="#services" className="link-scroll">{kst('FEATURES')}</a></li>
									<li><a href="#portfolio" className="link-scroll">{kst('HOW IT WORKS')}</a></li>
									<li><a href="#gallery" className="link-scroll">{kst('PRICING')}</a></li>
									<li><a href="#contact" className="link-scroll">{kst('LOG IN')}</a></li>
									<li><a href="#" className="menu-special-btn">{kst('SIGN UP')}</a></li>
								</ul>
							</div>
							<Row className="title-row">
								<Col xs={12} className="header-title">
									<h1>{kst('SITE MANAGEMENT AND OHS <br /> MADE EASY')}</h1>
								</Col>
								<Col xs={12}>
									<a href="#" className="special-btn">{kst('Learn more')}</a>
								</Col>
							</Row>
						</div>
					</nav>
				</header>
				<section className="section-1">
					<div>
						<MyCarousel2 items={ITEMS}/>
					</div>
				</section>
				<section className="section-2">
					<div className="container-fluid">
						<Row>
							<Col lg={5} sm={6} className="left-block">
								<div className="img-container">
									<img src="assets/images/not-logged-in/iphone8.png" className="iphone-img"/>
								</div>
							</Col>
							<Col lg={4} sm={6} xs={12} className="right-block">
								<Row>
									<Col xs={12}>
										<img src="assets/images/not-logged-in/logo-orange-bg.png" className="app-logo"/>
									</Col>
									<Col xs={12} className="section-row">
										<h2>{kst('The Keen Safety app')}</h2>
										<p>{kst('Innovation in safety procedures')}</p>
									</Col>
									<Col xs={12} className="section-row">
										<p>
											{kst('Keen Safety is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the when an unknown printer took a galley of type and scrambled it to make a type specimen book.')}
										</p>
										<p>
											{kst('It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.')}
										</p>
										<p>
											{kst('Site management and WHS made easy.')}
										</p>
									</Col>
									<Col xs={12} className="section-row button-row">
										<a href="#" className="special-btn orange-bg">{kst('Sign up')}</a>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>
				</section>
				<section className="section-3">
					<div className="container-fluid">
						<Row>
							<Col lg={12}>
								<h2>{kst('The complete OHS compliance toolkit')}</h2>
							</Col>
							<div className="images-row">
								<Col md={3} sm={6} className="text-center">
									<div className="circle-item circle-item-1"></div>
									<h4>{kst('All files saved to <br /> the cloud')}</h4>
								</Col>
								<Col md={3} sm={6} className="text-center">
									<div className="circle-item circle-item-2"></div>
									<h4>Issue, receive <br /> and manage jobs</h4>
								</Col>
								<Col md={3} sm={6} className="text-center">
									<div className="circle-item circle-item-3"></div>
									<h4>{kst('Generate Safe Work <br /> Method Statements <br /> (SWMS)')}</h4>
								</Col>
								<Col md={3} sm={6} className="text-center">
									<div className="circle-item circle-item-4"></div>
									<h4>Mobile app time <br /> and GPS tracking</h4>
								</Col>
							</div>

						</Row>
					</div>
				</section>
				<section className="section-4">
					<div className="container-fluid">
						<Row>
							<Col lg={6} sm={6} className="left-block">
								<div className="img-container">
									<img src="assets/images/not-logged-in/imac.png" className="iphone-img"/>
								</div>
							</Col>
							<Col lg={6} sm={6} xs={12} className="right-block">
								<Row>
									<Col xs={12} className="section-row">
										<h2>Work with your team to achieve safety goals</h2>
										<p>{kst('Once your business is a member of Keen Safety you will be able to:')}</p>
									</Col>
									<Col xs={12} className="section-row">
										<ul>
											<li><b>{kst('Remotely issue jobs')}</b> {kst('to staff and contractors')}</li>
											<li><b>{kst('Record site safety practices')}</b> {kst('and keep secure records of safety initiatives')}</li>
											<li><b>{kst('Record staff and contractor details')}</b> {kst('including all licenses and tickets')}</li>
											<li><b>{kst('Record safety meetings')}</b> {kst('and keep records to protect your business')}</li>
											<li><b>{kst('Accept, decline, or subcontract jobs')}</b> {kst('that have been issued to you')}</li>
											<li><b>{kst('Generate Safe Work Method Statements (SWMS)')}</b> {kst('and WHS Mangement Plans')}</li>
											<li><b>{kst('Produce photo records of safety compliance')}</b> {kst('which are saved to the cloud')}</li>
											<li><b>{kst('Manage your labour costs')}</b> {kst('with employee and contractor time and GPS stamping')}</li>
										</ul>
									</Col>
									<Col xs={12} className="section-row button-row">
										<a href="#" className="special-btn orange-bg">{kst('Learn More')}</a>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>
				</section>
				<footer className="footer">
					<div className="container-fluid">
						<Row className="footer-row">
							<Col lg={3} md={4} className="col-left text-left">
								<img className="footer-logo" src="assets/images/not-logged-in/footer-logo.png"/>
							</Col>
							<Col lg={6} md={4} xs={12} className="col-middle text-center">
								<div>{kst('© Keen Training 2018. All rights reserved. Park of the Keen Group')}</div>
							</Col>
							<Col lg={3} md={4} className="col-right text-right soctal-btns">
								<img className="soctal-btn" src="assets/images/not-logged-in/fb-logo.png"/>
								<img className="soctal-btn" src="assets/images/not-logged-in/tw-logo.png"/>
								<img className="soctal-btn" src="assets/images/not-logged-in/youtube-logo.png"/>
							</Col>
						</Row>
					</div>
				</footer>
			</div>
		)
	}
}
