import React, { useContext } from 'react'
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

export const CollapsibleSection = ({ title, status, count, icon, children, toggleSection, collapsedSections, isEmpty = false }) => {
    const isCollapsed = collapsedSections[status];
    const { theme, user, setTheme } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    
    const getSectionColors = () => {
        switch (status) {
            case 'pending':
                return {
                    bg: theme === 'light' ? 'bg-yellow-300' : 'bg-yellow-900/10',
                    border: theme === 'light' ? 'border-yellow-500' : 'border-yellow-800',
                    text: theme === 'light' ? 'text-yellow-900 ' : 'text-yellow-200',
                    iconColor: 'text-yellow-700'
                };
            case 'in-progress':
                return {
                    bg: theme === 'light' ? 'bg-blue-300' : 'bg-blue-900/10',
                    border: theme === 'light' ? 'border-blue-500' : 'border-blue-800',
                    text: theme === 'light' ? 'text-blue-900 ' : 'text-blue-200',
                    iconColor: 'text-blue-700'
                };
            case 'completed':
                return {
                    bg: theme === 'light' ? 'bg-green-300' : 'bg-green-900/10',
                    border: theme === 'light' ? 'border-green-500' : 'border-green-800',
                    text: theme === 'light' ? 'text-green-900 ' : 'text-green-200',
                    iconColor: 'text-green-700'
                };
            default:
                return {
                    bg: theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/10',
                    border: theme === 'light' ? 'border-gray-200' : 'border-gray-800',
                    text: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
                    iconColor: 'text-gray-500'
                };
        }
    };

    const colors = getSectionColors();


    return (
        <Card className={`mb-6 overflow-hidden transition-all duration-300 ${colors.bg} ${colors.border} border-3`}>
            <CardHeader
                className={`pl-4 cursor-pointer hover:opacity-90 transition-opacity ${colors.bg}`}
                onClick={() => toggleSection(status)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={colors.iconColor}>
                            {icon}
                        </div>
                        <h3 className={`text-2xl font-bold ${colors.text}`}>
                            {title}
                        </h3>
                        {/* <Badge variant="secondary" className={`ml-2 ${colors.text} } `}>
                                {count}
                            </Badge> */}
                    </div>
                    <div className={`transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'} ${colors.text}`}>
                        <ChevronDown className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-none'}`}>
                <CardContent className="px-4 pt-0">
                    {isEmpty ? (
                        <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {/* <div className={`${colors.text} opacity-50 mb-2`}>
                                    {icon}
                                </div> */}
                            <p className="text-lg">No {title.toLowerCase()} tasks</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {children}
                        </div>
                    )}
                </CardContent>
            </div>
        </Card>
    );
};