import Subscription from '../../Components/Subscription';
import ShowMoreBtn from './ShowMoreBtn';

const Subscriptions = ({subscriptions, activeTab, setActiveTab}) =>{
    const subscriptionsToShow = subscriptions?.length > 5 && activeTab=='main' ? subscriptions.slice(0,5) : subscriptions

    return(
        <section className='featured-section'>
            <div className="featured-section__title_wrapper">
                <h2 className='featured-section__title'>Подписки</h2>
                <ShowMoreBtn collection={subscriptions} redirect={'subscriptions'} maxValue={5} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
            <div className='featured-section__subscriptions-wrapper'>
                {subscriptionsToShow?.map((id) =>
                    <Subscription authorId={id}/>
                )}
            </div>
        </section>
    )
}

export default Subscriptions