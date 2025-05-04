import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StarsBackground from './components/StarsBackground.tsx'
import { ShootingStars } from './components/ShootingStars.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StarsBackground stars ={1000} parallaxIntensity={0.05} maxSize={0.8}/>
    <StarsBackground stars ={800} parallaxIntensity={0.1} maxSize={1.2}/>
    <StarsBackground stars ={500} parallaxIntensity={0.12} maxSize={1.4}/>
    <StarsBackground stars ={200} parallaxIntensity={0.14} maxSize={1.8}/>
    <StarsBackground stars ={100} parallaxIntensity={0.16} maxSize={5}/>
    <ShootingStars 
      count={30}       
      size={0.3}       
      speed={0.05}     
      parallaxIntensity={0.05} 
    />
    <ShootingStars 
      count={8}       
      size={0.4}       
      speed={2.5}     
      parallaxIntensity={0.08} 
    />
    <ShootingStars 
      count={6}  
      size={1.2}
      speed={4}      
      parallaxIntensity={0.1}
    />
    <App />
  </StrictMode>,
)
