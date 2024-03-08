import {lazy, Suspense} from 'react';
import ReactToast from './components/reactToast';
import {Routes, Route } from 'react-router-dom';

// lazy laoding
const Inbox = lazy(() => import('./pages/inbox'));
const ViewEmail = lazy(()=> import('./pages/viewEmail'));
const Sent =  lazy(()=> import('./pages/sent'));
const Starred =  lazy(()=> import('./pages/starred'));
const Drafts =  lazy(()=> import('./pages/drafts'));
const Bin =  lazy(()=> import('./pages/bin'));
const AllMail = lazy(()=> import('./pages/allmail'));
const SearchPage = lazy(()=> import('./pages/searchPage'));

function Main(){

    return(
        <div className='main'>
            <Suspense fallback={<ReactToast />}>
                <Routes>
                    <Route path='/' element={<Inbox />} />
                    <Route path='/viewEmail/:id' element={<ViewEmail />} />
                    <Route path='/starred' element={<Starred />} />
                    <Route path='/sent' element={<Sent />} />
                    <Route path='/drafts' element={<Drafts />} />
                    <Route path='/bin' element={<Bin />} />
                    <Route path='/allmail' element={<AllMail />} />
                    <Route path='/search/:query' element={<SearchPage />} />
                </Routes>
            </Suspense>
        </div>
    )
}
export default Main;