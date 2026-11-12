'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LogPage() {
    return (
        <div className="p-6 space-y-4">
            <Card className={`overflow-auto rounded-lg shadow-lg py-0 max-h-[75vh] sm:max-h-[75vh] md:max-w-[cal(100vw-256px)] md:min-w-[cal(100vw-256px)]`}>
                <CardHeader className="p-2">
                    Lorem IPSUM
                </CardHeader>
                <CardContent className="p-4">
                    <div className="relative overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]">
                        <table className="table-fixed">
                            <thead>
                                <tr>
                                    <th>Song</th>
                                    <th>Song</th>
                                    <th>Song</th>
                                    <th>Artist</th>
                                    <th>Artist</th>
                                    <th>Artist</th>
                                    <th>Year</th>
                                    <th>Year</th>
                                    <th>Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                    <td>Malcolm Lockyer</td>
                                    <td>Malcolm Lockyer</td>
                                    <td>Malcolm Lockyer</td>
                                    <td>1961</td>
                                    <td>1961</td>
                                    <td>1961</td>
                                </tr>
                                <tr>
                                    <td>Witchy Woman</td>
                                    <td>Witchy Woman</td>
                                    <td>Witchy Woman</td>
                                    <td>The Eagles</td>
                                    <td>The Eagles</td>
                                    <td>The Eagles</td>
                                    <td>1972</td>
                                    <td>1972</td>
                                    <td>1972</td>
                                </tr>
                                <tr>
                                    <td>Shining Star</td>
                                    <td>Shining Star</td>
                                    <td>Shining Star</td>
                                    <td>Earth, Wind, and Fire</td>
                                    <td>Earth, Wind, and Fire</td>
                                    <td>Earth, Wind, and Fire</td>
                                    <td>1975</td>
                                    <td>1975</td>
                                    <td>1975</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </CardContent>
            </Card>

        </div>
    )
}