import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "../src/components/home";
import { Routes, Route, Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { connect } from "./redux/blockchain/blockchainActions";
import {
  CHAIN_LIST,
  MENU_ELEMENTS
} from "../src/config";
import { fetchData } from "./redux/data/dataActions";
import Mint from "./components/Mint";




import { setData } from "./redux/blockchain/blockchainActions";

import upArrowImg from './assets/img/up-arrow.png';


function App() {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [chain, setChain] = useState("");
  const [isOpen, setOpen] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  // const data = useSelector((state) => state.data);
  // eslint-disable-next-line no-unused-vars
  const [isMobile, setMobile] = useState(false);
  // const [feedback, setFeedback] = useState("Enter the Cowverse");

  // const [blockchainData, setBlockchainData] = useState();

  window.history.scrollRestoration = 'manual'

  window.onscroll = () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("up").style.display = "block";
    } else {
      document.getElementById("up").style.display = "none";
    }
  };

  window.onresize = () => {
    if (window.innerWidth >= 768) {
      setMobile(false);
      closeSideBar();
    } else {
      setMobile(true);
    }
  };

  const handleIsOpen = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  const scrollTo = (section) => {
    // add menu dimensions
    const menu = document.getElementById("menu").offsetHeight;
    // scroll
    const position = document.getElementById(section).offsetTop;
    window.scrollTo(0, position - menu);
  }
  

  // dynamic menu
  const buildMenu = (isMobile) => {
    const commonDesktopClasses =
      "col text-center my-auto py-5 p-md-0 cursor-pointer menu-selected ";
    const commonMobileClasses = "menu-item";
    // from menuItem obj generate menu template
    return MENU_ELEMENTS.map((item, index) => (
      <Link key={index} to={item.navLink} className={isMobile ? commonMobileClasses : commonDesktopClasses} style={{color: "white"}}>
        <div
          key={"menu" + index}
          
          onClick={(e) => {
            closeSideBar();
          }}
        >
         {item.displayName}
        </div>
      </Link>
    ));
  };

  const getData = () => {
    if (blockchain.account && blockchain.smartContract) {
      
      dispatch(fetchData(blockchain.account));

      // send blockchain var to Mint component
      dispatch(setData(blockchain.account));

    }
  };

  const getChain = async () => {
    function getChainData(chainId) {
      let result = "";
      CHAIN_LIST.forEach((item) => {
        if (item.id === chainId) {
          result = item;
        }
      });
      return result;
    }
    let networkId;
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      networkId = await ethereum.request({
        method: "net_version",
      });
    }
    setChain(getChainData(networkId));
  };

  useEffect(() => {
    detectChainChanges();
    getData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain.account]);

  const detectChainChanges = () => {
    if (window.ethereum) {
      getChain();
      window.ethereum.on("chainChanged", () => {
        getChain();
      });
    }
  };

  detectChainChanges();

  // format the string of user wallet (first 5 and 4 last)
  const formatWallet = (account) => {
    const firstPartAddress = account.slice(0, 5);
    const secondPartAddress = account.substring(account.length - 4);
    return firstPartAddress + "..." + secondPartAddress;
  };

  return (
    <div className="font-size-14px">
      <Menu />
      <Menu
        burgerButtonClassName={"d-block d-md-none"}
        isOpen={isOpen}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
      >
        <Link to="/mint" className="menu-item" style={{color: "white"}}>
          <div
            
            onClick={(e) => {
             
              closeSideBar();
            }}
          >
            MINT
          </div>
        </Link>
        {buildMenu(true)}

        {}
      </Menu>
      <div
        className="up cursor-pointer"
        id="up"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("start");
        }}
      >
        <img className="w-65" src={upArrowImg} alt="THE FOOLS NFT" />
      </div>

      <div className="container-xxxl" id="start" >
        <div id="menu" className="row sticky-header ">
          <div className="col-12 background-color-black p-3">
           
              <div className="d-none d-md-block col-md-12 text-center text-md-end">
                <div
                  className="row justify-content-end "
                  style={{ fontSize: "15px" }}
                >
                  <Link to="/mint" style={{
                      border: "1px solid white",
                      borderRadius: "10px",
                      padding: "5px",
                    }} className="col-2 text-center my-auto py-5 p-md-1 cursor-pointer menu-selected home-mint-btn">
                  <div
                  
                  >
                    Mint
                  </div>
                  </Link>
                  {buildMenu(false)}
                  {!blockchain.account ? (
                    <div
                      className="col-2  text-center my-auto py-5 p-md-1 cursor-pointer menu-selected home-mint-btn "
                      style={{
                        border: "1px solid white",
                        borderRadius: "10px",
                        
                        
                        
                      
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Connect Wallet
                    </div>
                  ) : (
                    <>
                      {}
                      <div
                        className="col-6 col-md-3 text-center my-auto py-5 p-md-1"
                        style={{
                          border: "1px solid white",
                          borderRadius: "10px",
                        }}
                      >
                        {formatWallet(blockchain.account)}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-12 d-block d-md-none my-3">
                {!blockchain.account ? (
                  <div
                    className="text-center my-4 py-1 my-auto cursor-pointer menu-selected"
                    style={{
                      border: "1px solid white",
                      borderRadius: "10px",
                      padding: "5px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    Connect Wallet
                  </div>
                ) : (
                  <div
                    className="text-center my-4 py-1 my-auto"
                    style={{ border: "1px solid white", borderRadius: "10px" }}
                  >
                    {formatWallet(blockchain.account)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
        
        
          
        
          
        </Routes>
        
      </div>
    
  );
}

export default App;
