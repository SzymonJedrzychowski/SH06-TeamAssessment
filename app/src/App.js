import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Homepage from "./components/pages/Homepage";
import Partner from "./components/pages/Partner";
import PartnerEditItem from "./components/pages/PartnerEditItem";
import PartnerReviewChange from "./components/pages/PartnerReviewChange";
import Layout from "./components/layout/Layout";
import Editorial from "./components/pages/Editorial";
import CheckItem from "./components/pages/CheckItem";
import SuggestChanges from "./components/pages/SuggestChanges";
import Publish from "./components/pages/Publish";
import EditPrevious from "./components/pages/EditPrevious";
import CreateAccount from "./components/pages/CreateAccount";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import ManageTags from "./components/pages/ManageTags";
import InformationDialog from "./components/pages/InformationDialog";
import AlertDialog from "./components/pages/AlertDialog";

/**
 * App is responsible for loading data and routing to other pages.
 *
 * @author Szymon Jedrzychowski
 */
function App() {
  const [informData, setInformData] = useState([false, null, null, null])
  const [alertData, setAlertData] = useState([false, null, null, null, null, null])

  const dialogData = () => {
    const resetInformData = () => setInformData([false, null, null, null]);
    return {setInformData, setAlertData, resetInformData};
  }

  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage/>}/>

          <Route path="/partner" element={<Partner dialogData={dialogData()}/>}/>
          <Route path="/partnerEditItem" element={<PartnerEditItem dialogData={dialogData()}/>}/>
          <Route path="/partnerReviewChange" element={<PartnerReviewChange dialogData={dialogData()}/>}/>

          <Route path="/editorial" element={<Editorial dialogData={dialogData()}/>}/>
          <Route path="/checkItem" element={<CheckItem dialogData={dialogData()}/>}/>
          <Route path="/suggestChanges" element={<SuggestChanges dialogData={dialogData()}/>}/>
          <Route path="/publish" element={<Publish dialogData={dialogData()}/>}/>
          <Route path="/editPrevious" element={<EditPrevious dialogData={dialogData()}/>}/>
          <Route path="/manageTags" element={<ManageTags dialogData={dialogData()}/>}/>
          <Route path="/createAccount" element={<CreateAccount dialogData={dialogData()}/>}/>
          <Route path="/login" element={<Login dialogData={dialogData()}/>}/>
          <Route path="/signUp" element={<SignUp dialogData={dialogData()}/>}/>
          
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </Layout>
      <InformationDialog open={informData[0]} handleClose={() => informData[1]} title={informData[2]} message={informData[3]} />
      <AlertDialog open={alertData[0]} handleClose={()=>alertData[1]} title={alertData[2]} message={alertData[3]} option1={alertData[4]} option2={alertData[5]} />
    </div>
  );
}

export default App;
