"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import { FaCheck } from "react-icons/fa";
import "@/styles/pages/about.css";

function Page() {
  return (
    <div className="about">
      <div className="title-holder pages container">
        <span>Play It, Live It, Experience It 360°</span>
        <h1 className="main-title">
          <hr />
          Discover Egypt Your Way
          <hr />
        </h1>
        <p className="sub-title">
          A complete tourism ecosystem powered by culture, technology, and a
          game that turns exploration into an unforgettable adventure.
        </p>
      </div>

      <Navigations
        items={[
          {
            name: "about us",
            href: "",
          },
        ]}
        container={`main`}
      />
      <div className="container">
        <div className="about-section ">
          <h3>ABOUT US</h3>
          <p>
            Masr360 is a fully integrated digital tourism ecosystem designed to
            transform the way people explore Egypt. We don’t just help visitors
            find places -
            <span>
              We guide them through a complete journey where every step is
              interactive, rewarding, and meaningful.
            </span>
          </p>
          <p>
            At the heart of Masr360 lies our unique gamified experience: a
            24-step exploration game that encourages travelers to visit
            locations, try local food, attend cultural events, meet artisans,
            and discover the real Egypt - while earning points they can redeem
            for actual rewards.
          </p>
          <h5>Around this game, we built a full ecosystem:</h5>
          <ul>
            <li>
              <span>A discovery hub</span> for every governorate and attraction
            </li>
            <li>
              <span>A nightlife and cultural guide</span> for experiences after
              8 PM
            </li>
            <li>
              <span>A marketplace</span> supporting handmade, authentic Egyptian
              crafts
            </li>
            <li>
              <span>Local partners</span> including cafés, restaurants,
              artisans, and tour agencies
            </li>
            <li>
              <span>A reward system</span> that connects all these elements into
              one seamless loop
            </li>
          </ul>
          <h5>Masr360 is not an app -</h5>
          <p>
            <span>
              It's an end-to-end ecosystem that connects tourists, local
              communities, businesses, and culture through one unified platform.
            </span>
            <br />
            Our goal is simple: to let every visitor experience Egypt fully… and
            enjoy every moment of the journey.
          </p>
        </div>
        <div className="vision-mission ">
          <div className="mission">
            <h3>OUR MISSION</h3>
            <h5>Around this game, we built a full ecosystem:</h5>
            <ul>
              <li>
                <span>A discovery hub</span> for every governorate and
                attraction
              </li>
              <li>
                <span>A nightlife and cultural guide</span> for experiences
                after 8 PM
              </li>
              <li>
                <span>A marketplace</span> supporting handmade, authentic
                Egyptian crafts
              </li>
              <li>
                <span>Local partners</span> including cafés, restaurants,
                artisans, and tour agencies
              </li>
              <li>
                <span>A reward system</span> that connects all these elements
                into one seamless loop
              </li>
            </ul>
          </div>
          <div className="vision">
            <h3>OUR VISION</h3>
            <p>
              To build Egypt’s first all-in-one tourism ecosystem - where
              exploration becomes a game, culture becomes interactive, and every
              visitor experiences the country in a fun, authentic, and connected
              way.
            </p>
          </div>
        </div>
        <div className="game-center ">
          <h3>GAME CENTER - OUR CORE FEATURE</h3>
          <h5>Our Game Is the Heart of Masr360</h5>

          <p>
            The Masr360 Game transforms tourism from “just visiting places” into
            an interactive adventure
          </p>
          <ul>
            <li>
              <FaCheck /> Earn points by visiting sites
            </li>
            <li>
              <FaCheck />
              Unlock challenges
            </li>
            <li>
              <FaCheck />
              Complete cultural experiences
            </li>
            <li>
              <FaCheck />
              Try partner cafés & restaurants
            </li>
            <li>
              <FaCheck />
              Join guided tours
            </li>
            <li>
              <FaCheck />
              Redeem points for real discounts
            </li>
          </ul>
          <h5>It’s not entertainment -</h5>
          <p>
            <span>
              It's the engine that connects the entire ecosystem: discovery,
              partners, marketplace, and tourism services.
            </span>
          </p>
          <p>This is what no other tourism platform in Egypt offers.</p>
        </div>
        <div className="why-masr ">
          <h3>WHY MASR360?</h3>
          <p>
            Masr360 is the only platform that turns discovering Egypt into a
            connected, gamified ecosystem. We don’t just list places - we create
            an experience that links tourists, artisans, nightlife, restaurants,
            tour agencies, and culture all in one seamless journey.
          </p>
          <p>
            Through our 24-step game, visitors explore Egypt, unlock challenges,
            earn rewards, and engage with trusted local businesses. We empower
            artisans, support cultural communities, and bring authentic Egyptian
            experiences to the world.
          </p>
          <p>
            Masr360 delivers real value to everyone: tourists, small businesses,
            creatives, and Egypt’s cultural identity.
          </p>
        </div>
        <div className="our-values ">
          <div className="top">
            <h3>OUR VALUES</h3>
            <p>
              Experience • Authenticity • Impact • Innovation • Culture •
              Simplicity
            </p>
          </div>

          <div className="cards-grid">
            <div className="card">
              <h4>Authenticity </h4>
              <p>We showcase the real Egypt, not the tourist traps.</p>
            </div>
            <div className="card">
              <h4>Creativity </h4>
              <p>
                We bring culture, tourism, and gaming together in a new way.
              </p>
            </div>
            <div className="card">
              <h4>Inclusivity </h4>
              <p>
                Supporting local artisans, small businesses, and all travelers.
              </p>
            </div>
            <div className="card">
              <h4>Innovation </h4>
              <p>Turning tourism into a smart, gamified digital experience.</p>
            </div>
            <div className="card">
              <h4>Impact </h4>
              <p>
                Helping communities grow while improving the tourist journey.
              </p>
            </div>
          </div>
        </div>
        <div className="closing">
          <h5>Masr360</h5>
          <div>
            <p>Where Egypt becomes an adventure.</p> /
            <p>Where every step is a story.</p> /
            <p>Where exploration is a game.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
