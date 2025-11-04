'use client';

import React, { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardHeader from './DashboardHeader';

interface DashboardRootProps {
    children: ReactNode;
}

function DashboardRoot({ children }: DashboardRootProps) {
    return (
        <div className="min-vh-100 bg-light">
            <DashboardHeader />
            
            <main className="py-4">
                {children}
            </main>
        </div>
    );
}

export default DashboardRoot;