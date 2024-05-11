import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CompileRecipe from './pages/CompileRecipe';
import MealCard from './components/MealCard';
import { MealDesigner } from './pages/MealDesigner';
import { WelcomePage } from './pages/Welcome';
import { CookingModePage } from './pages/CookingMode';
import './style/main.scss';

import GraphVis from './components/GraphVis';
import { theme } from './style/theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <div className="content">
                    <BrowserRouter>
                        {/* <Navbar /> */}
                        <Routes>
                            <Route exact path="/" element={<WelcomePage />} />
                            <Route
                                path="build-a-meal"
                                element={<MealDesigner />}
                            />
                            <Route
                                path="cook-mode"
                                element={<CookingModePage />}
                            />
                            <Route
                                path="/compile"
                                element={<CompileRecipe />}
                            />
                            <Route path="/graph-vis" element={<GraphVis />} />
                            <Route path="/recipe/:id" element={<MealCard />} />
                            <Route path="*" render={() => <div />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
