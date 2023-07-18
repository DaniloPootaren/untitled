export const getChecklistEmailTemplate = (data: {
  user: string;
  checklist: string;
  hospital: string;
  department: string;
  ward: string;
  visitingTeam: string;
  submittedDate: string;
}): string => {
  const {
    user,
    checklist,
    hospital,
    department,
    ward,
    submittedDate,
    visitingTeam,
  } = data;
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                         <meta http-equiv="X-UA-Compatible" content="ie=edge">
             <title>Document</title>

             <style>

             * {
             font-family: inherit;
             }

           .styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}
</style>
</head>
<body>
  <div>
<p>
<strong>Dear ${user}</strong>
</p>

<p>
<table class="styled-table">
<thead>
<tr>
<th>Checklist</th>
<th>Hospital</th>
<th>Department</th>
<th>Ward</th>
<th>Visiting Team</th>
<th>Submitted Date</th>
</tr>
</thead>

<tbody>
<tr>
    <td>${checklist}</td>
    <td>${hospital}</td>
    <td>${department}</td>
    <td>${ward}</td>
    <td>${visitingTeam}</td>
    <td>${submittedDate}</td>
</tr>
</tbody>
</table>
</p>

<p>Download attachment for more details</p>
</div>
</body>
</html>

`;
};
