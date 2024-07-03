import * as React from 'react';

interface TableProps {
    data: any[];
    columns: { header: string, key: string }[];
}

const Table: React.FC<TableProps> = ({ data, columns }) => {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col) => (
                            <td key={col.key}>{row[col.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
