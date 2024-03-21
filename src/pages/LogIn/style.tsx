import styled from "@emotion/styled";

export const GlobalStyles = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Raleway:400,100,200,300');

  /* GENERAL RESETS */
  *,
  *:before,
  *:after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }
  html {
    box-sizing: border-box;
  }
  a {
    color: #666;
    text-decoration: none;
  }
  a:hover {
    color: #4fda8c;
  }
`;

export const BodyStyles = styled.div`
  body {
    position: relative;
    color: #666;
    font: 16px/26px "Raleway", sans-serif;
    text-align: center;
    height: 100%;
    background: -moz-linear-gradient(270deg, rgba(34, 46, 64, 1) 0%, rgba(81, 195, 184, 1) 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(34, 46, 64, 1)), color-stop(100%, rgba(81, 195, 184, 1)));
    background: -webkit-linear-gradient(270deg, rgba(34, 46, 64, 1) 0%, rgba(81, 195, 184, 1) 100%);
    background: linear-gradient(180deg, rgba(34, 46, 64, 1) 0%, rgba(81, 195, 184, 1) 100%);
    overflow: hidden;
  }
`;

export const ButtonStyles = styled.button`
  a.button {
    position: absolute;
    left: 20px;
    top: 20px;
    height: auto;
    padding: 0.8rem 1.0rem;
    font-size: 0.8rem;
    line-height: normal;
    text-transform: uppercase;
    font-family: 'Proxima Nova', sans-serif;
    font-weight: 700;
    letter-spacing: 0;
    border-radius: 0;
    border: 1px solid #2D515C;
    text-decoration: none;
    color: #fff;
    background-color: transparent;
    transition: all 0.2s ease-in-out;
    &:hover {
      border-color: #2D515C;
      color: #fff;
      padding: 1.0rem 3.2rem;
    }
    @media only screen and (min-width: 22em) {
      padding: 1.0rem 2.8rem;
      font-size: 1.0rem;
    }
  }
`;

export const LoginStyles = styled.div`
  .login {
    margin: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
`;

export const WrapStyles = styled.div`
  .wrap {
    position: static;
    margin: auto;
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  .wrap:after {
    content: "";
    display: table;
    clear: both;
  }
`;

export const LogoStyles = styled.label`
  .logo {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #4FC1B7;
  }
  .logo img {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 30px;
  }
  .logo a {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

/* TOGGLE */
export const Toggle_Wrap = styled.div`
    position: absolute;
    z-index: 4;
    top: 40px;
    right: 17px;
    width: 80px;
    height: 1px;

  #toggle-terms.open #cross {
    transition-delay: .9s;
    transition-duration: .2s;
    transform: rotate(45deg);
  }

  #toggle-terms.open #cross span {
    position: absolute;
    z-index: 4;
    transition-delay: 0s;
    transition-duration: 0s;
  }

  #toggle-terms.open #cross span:nth-child(1) {
    top: 15%;
    left: 19px;
    height: 70%;
    width: 1px;
  }

  #toggle-terms.open #cross span:nth-child(2) {
    left: 15%;
    top: 19px;
    width: 70%;
    height: 1px;
  }

  #toggle-terms #cross span:nth-child(1) {
    height: 0;
    transition-delay: .625s;
  }

  #toggle-terms #cross span:nth-child(2) {
    width: 0;
    transition-delay: .375s;
  }
`;

export const Toggle_Terms_Span= styled.span`
    background: #fff;
    border-radius: 0;
`

/* TOGGLE TERMS */
export const Toggle_Terms_Div = styled.div`
    position: absolute;
    z-index: 4;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    margin: auto;
    display: block;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 100%;
    opacity: 0;
    -webkit-transform: translate(-6px, 20px);
    -moz-transform: translate(-6px, 20px);
    -o-transform: translate(-6px, 20px);
    transform: translate(-6px, 20px);
`;

// cross
export const Toggle_Terms = styled.div`
    position: absolute;
    z-index: 4;
    height: 100%;
    width: 100%;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
`;

export const Terms = styled.div`
  position: absolute;
  z-index: 3;
  margin: 40px 0 0;
  padding: 1.5em 1em;
  width: 100%;
  height: calc(100% - 40px);
  border-radius: 0;
  background: #fff;
  text-align: left;
  overflow: auto;
  will-change: transform;
  transform: translateY(-110%);
  opacity: 0;
  &.open {
    transform: translateY(0);
    animation: show_terms 0.5s 0.2s ease forwards;
  }
  &.closed {
    transform: translateY(0);
    opacity: 1;
    animation: hide_terms 0.6s 0.2s ease forwards;
  }
  p {
    margin: 1em 0;
    font-size: 0.9em;
  }
  h3 {
    margin: 2em 0 0.2em;
  }
  p.small {
    margin: 0 0 1.5em;
    font-size: 0.8em;
  }
`;

export const Recovery = styled.div`
  position: absolute;
  z-index: 3;
  margin: 40px 0 0;
  padding: 1.5em 1em;
  width: 100%;
  height: calc(100% - 40px);
  border-radius: 0;
  background: #fff;
  text-align: left;
  overflow: auto;
  will-change: transform;
  transform: translateY(-110%);
  opacity: 0;
  &.open {
    transform: translateY(0);
    animation: show_terms 0.5s 0.2s ease forwards;
  }
  &.closed {
    transform: translateY(0);
    opacity: 1;
    animation: hide_terms 0.6s 0.2s ease forwards;
  }
  p {
    margin: 1em 0;
    font-size: 0.9em;
  }
  h3 {
    margin: 2em 0 0.2em;
  }
  p.small {
    margin: 0 0 1.5em;
    font-size: 0.8em;
  }
`;

export const Content = styled.div`
  position: fixed;
  z-index: 1;
  float: none;
  margin: 0 auto;
  width: 100%;
  height: 40px;
  background: -moz-linear-gradient(90deg, rgba(62,181,169,1) 0%, rgba(111,226,204,1) 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(111,226,204,1)), color-stop(100%, rgba(62,181,169,1)));
  background: -webkit-linear-gradient(90deg, rgba(62,181,169,1) 0%, rgba(111,226,204,1) 100%);
  background: linear-gradient(0deg, rgba(62,181,169,1) 0%, rgba(111,226,204,1) 100%);
  box-shadow: none;
  overflow: hidden;
`;

export const SlideShow = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 10px 0 0 10px;
`;

export const SlideShowTitle = styled.h2`
  margin: .0em auto .0em auto;
  text-align: center;
  font-size: 1.4em;
  color: #fff;
  line-height: .5em;
`;

export const Slide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1em 3em;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const SlideOne = styled(Slide)`
  background-image: url("http://res.cloudinary.com/dpcloudinary/image/upload/v1506186248/dots.png");
  background-repeat: no-repeat;
  background-position: 0% 50%;
`;

export const SlideTwo = styled(Slide)`
  background-image: url("http://res.cloudinary.com/dpcloudinary/image/upload/v1506186248/gears.png");
  background-repeat: no-repeat;
  background-position: 0% 50%;
`;

export const SlideThree = styled(Slide)`
  background-image: url("http://res.cloudinary.com/dpcloudinary/image/upload/v1506186248/splat.png");
  background-repeat: no-repeat;
  background-position: 0% 5%;
`;

export const SlideFour = styled(Slide)`
  background-image: url("http://res.cloudinary.com/dpcloudinary/image/upload/v1506186248/ray.png");
  background-repeat: no-repeat;
  background-position: 0% 50%;
`;

export const UserContainer = styled.div`
  padding-top: 0;
  float: left;
  width: 50%;
  height: 500px;
  box-shadow: -3px 0px 45px -6px rgba(56,75,99,0.61);
  border-radius: 0 10px 10px 0;
  border: 0;
`;

export const UserActions = styled.div`
  margin: 0;
  text-align: right;
`;

export const FormWrap = styled.div`
  margin: 3em auto 0;
`;

export const TabsContent = styled.div`
  padding: 1.5em 2.5em;
`;

export const Paragraph = styled.p`
  position: relative;
`;

export const ArrowIcon = styled.i`
  position: absolute;
  top: 8px;
  left: -16px;
  display: block;
  font-size: 0.8em;
  color: #fff;
  opacity: 0.3;
  transform: translate(0, 0);
  transition: transform 0.3s 0.3s ease, opacity 0.6s 0s ease;

  &.active {
    transform: translate(-3px, 0);
    opacity: 0.8;
  }

  &.inactive {
    transform: translate(0, 0);
    opacity: 0.3;
  }
`;
