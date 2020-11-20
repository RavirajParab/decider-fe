import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RSIOversold from "./RSIOversold";
import MMI from "./Mmi";
import AVD from "./Avd";
import FiveDaysPerformance from "./FiveDaysPerformance";
import FourteenDaysPerformance from "./FourteenDaysPerformance";
//import RSIOverbought from "./RSIOverbought";
import Etf from "./Etf";
import ShortPositions from "./ShortPositions";
import Balance from "./Balance";
//import FellToday from "./FellToday";
import ShortCandidate from "./ShortCandidate";
import Performance from "./Performance";
import Transact from "./Transact";
import DeliveryPositions from "./DeliveryPositions";
import TickerLoader from "./TickerLoader";
import Ticker from "./Ticker";

const Navigation = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          Decider v4
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/overbought">
                Overbought
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/fell">
                Falling
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/perf">
                Performance
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/five">
                5 Days
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fourteen">
                14 Days
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/etf">
                ETF
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/transact">
                Transact
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/ticker">
                Ticker
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/shortpositions">
                Short Positions
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/deliverypositions">
                Delivery Positions
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/sc">
                Short Candidate
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/balance">
                Balance
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Switch>
        <Route path="/five">
          <MMI />
          <AVD />
          <FiveDaysPerformance />
        </Route>

        <Route path="/fourteen">
          <MMI />
          <AVD />
          <FourteenDaysPerformance />
        </Route>
{/* 
        <Route path="/overbought">
          <MMI />
          <AVD />
          <RSIOverbought />
        </Route> */}

        <Route path="/sc">
          <MMI />
          <AVD />
          <ShortCandidate/>
        </Route>

        <Route path="/transact">
          <Transact />
        </Route>

        <Route path="/etf">
          <MMI />
          <AVD />
          <Etf />
        </Route>

        <Route path="/perf">
          <MMI />
          <AVD />
          <Performance />
        </Route>

        <Route path="/shortpositions">
          <MMI />
          <AVD />
          <ShortPositions />
        </Route>

        
        <Route path="/deliverypositions">
          <MMI />
          <AVD />
          <DeliveryPositions />
        </Route>

        <Route path="/balance">
          <Balance />
        </Route>

        {/* <Route path="/fell">
         <FellToday/>
        </Route> */}

        <Route path="/ticker">
         <Ticker/>
        </Route>

        <Route path="/">
          <MMI />
          <AVD />
          <RSIOversold />
        </Route>
      </Switch>
    </Router>
  );
};

export default Navigation;
