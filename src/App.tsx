import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StockOrders from './components/StockOrders';
import CreateOrderModal from './components/CreateOrderModal';
import StockView from './components/StockView';
import OrderDetails from './components/OrderDetails';
import Logistics from './components/Logistics';
import Landing from './components/Landing';
import UserList from './components/UserList';
import Coordination from './components/Coordination';
import Profile from './components/Profile';
import PowerAppsGuard from './components/PowerAppsGuard';
import { usePowerAppsInit } from './hooks/usePowerAppsInit';
import { initialStockOrders } from './data/dummyData';
import './index.css';

const App: React.FC = () => {
  // Initialize Power Apps SDK using custom hook
  const { isInitializing, error: initError } = usePowerAppsInit();

  // selectedUser state removed (not used)
  const [orders, setOrders] = useState(initialStockOrders);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // view state: include 'home'
  const [view, setView] = useState<'home' | 'orders' | 'stock' | 'order' | 'logistics' | 'users' | 'coordination' | 'profile'>('home');
  const [activeOrder, setActiveOrder] = useState<typeof initialStockOrders[number] | null>(null);

  // new: which logistics tile is selected (controls the main content area when view === 'logistics')
  const [logisticsSelection, setLogisticsSelection] = useState<string | null>(null);

  const handleAddOrder = (newOrder: typeof initialStockOrders[number]) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const openOrder = (o: typeof initialStockOrders[number]) => {
    setActiveOrder(o);
    setView('order');
  };

  const saveOrder = (updated: typeof initialStockOrders[number]) => {
    setOrders(prev => prev.map(p => p.id === updated.id ? updated : p));
    setActiveOrder(updated);
    setView('orders');
  };

  const renderLogisticsContent = () => {
    if (!logisticsSelection) {
      return (
        <div className="card">
          <div style={{padding:20,color:'var(--muted)'}}>Select a Logistics item on the left to view details here.</div>
        </div>
      );
    }

    // show appropriate component based on selection id
    switch (logisticsSelection) {
      case 'catalogue':
      case 'tools-catalogue':
      case 'asset-catalogue':
        return <StockView />; // reuse StockView for catalogues
      case 'orders':
        return <StockOrders orders={orders} onSelect={openOrder} />;
      case 'stock-levels':
      case 'asset-stock-levels':
        return (
          <div className="card">
            <h3 style={{marginTop:0}}>Stock Levels</h3>
            <div style={{padding:12,color:'var(--muted)'}}>Stock levels overview (placeholder).</div>
          </div>
        );
      default:
        return (
          <div className="card">
            <h3 style={{marginTop:0}}>{logisticsSelection}</h3>
            <div style={{padding:12,color:'var(--muted)'}}>Content for "{logisticsSelection}" not implemented in demo.</div>
          </div>
        );
    }
  };

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Initializing Power Apps SDK...</h2>
          <p style={{ color: 'var(--muted)' }}>Please wait while the application is being set up.</p>
        </div>
      </div>
    );
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#d13438' }}>
          <h2>Initialization Error</h2>
          <p>{initError}</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Please refresh the page to retry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header onNavigate={(v: string) => {
        if (v === 'home') setView('home');
        else if (v === 'stock') setView('stock');
        else if (v === 'logistics') setView('logistics');
        else if (v === 'orders') setView('orders');
        else if (v === 'users') setView('users');
        else if (v === 'coordination') setView('coordination');
        else if (v === 'profile') setView('profile');
      }} />
      <div className="app-body">
        <Sidebar onNavigate={(v: string) => {
          if (v === 'home') setView('home');
          else if (v === 'stock') setView('stock');
          else if (v === 'logistics') setView('logistics');
          else if (v === 'orders') setView('orders');
          else if (v === 'users') setView('users');
          else if (v === 'coordination') setView('coordination');
        }} />
        <main className="content-area">
          {view !== 'order' && view !== 'coordination' && (
            <section className="page-top">
              <div>
                <h1 className="page-title">
                  {view === 'home' ? 'Welcome' : view === 'orders' ? 'Stock Orders' : view === 'stock' ? 'Stock Inventory' : view === 'logistics' ? 'Logistics' : view === 'profile' ? 'Profile' : ''}
                </h1>
                <div className="page-sub">
                  {view === 'home' ? 'Quick access' : view === 'orders' ? 'View, create, and manage stock requests' : view === 'stock' ? 'Browse tool stock and types' : view === 'logistics' ? 'Manage stock, tools and assets' : view === 'profile' ? 'Manage your account settings' : ''}
                </div>
              </div>

              {/* show Create New Order only on Orders page */}
              {view === 'orders' && (
                <button className="primary-cta" onClick={() => setShowCreateModal(true)}>Create New Order</button>
              )}
            </section>
          )}

          {view === 'home' && (
            <Landing
              onOpen={(id) => {
                // open Logistics view and preselect a sensible tile based on the landing tile id
                setView('logistics');

                // map landing tile ids to logistics tile ids (fallback to the landing id)
                const mapLandingToLogistics = (lid: string) => {
                  switch (lid) {
                    case 'stock-items': return 'catalogue';
                    case 'stock-orders': return 'orders';
                    case 'tools': return 'tools-catalogue';
                    case 'warehouses': return 'warehouse';
                    case 'reporting': return 'stock-levels';
                    case 'inspections': return 'confirmations';
                    default: return lid;
                  }
                };

                setLogisticsSelection(mapLandingToLogistics(id));
              }}
            />
          )}

          {view === 'orders' && <StockOrders orders={orders} onSelect={openOrder} />}
          {view === 'stock' && <StockView />}
          {view === 'logistics' && (
            <>
              <Logistics onSelect={(id) => { setLogisticsSelection(id); }} />
              <div style={{marginTop:12}}>
                {renderLogisticsContent()}
              </div>
            </>
          )}
          {view === 'order' && activeOrder && (
            <OrderDetails order={activeOrder} onBack={() => setView('orders')} onSave={saveOrder} />
          )}
          {view === 'users' && (
            <PowerAppsGuard>
              <UserList onSelectUser={(user) => {
                console.log('Selected user:', user);
                // Add any user selection handling here
              }} />
            </PowerAppsGuard>
          )}
          {view === 'coordination' && <Coordination />}
          {view === 'profile' && <Profile />}

        </main>
      </div>

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onAdd={(o) => {
            handleAddOrder(o);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
