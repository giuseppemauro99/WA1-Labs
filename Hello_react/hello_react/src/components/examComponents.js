import "bootstrap-icons/font/bootstrap-icons.css";
import {Container, Row, Col, Table, Button} from 'react-bootstrap';

function ExamScores(props){
    return(
        <Col>
            <ExamTable exams={props.exams}/>
        </Col>
    );
}

function ExamTable(props){
    return(
        <Table striped>
            <thead>
                <tr>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.exams.map((exam) => <ExamRow exam={exam} key={exam.code} />)
                }
            </tbody>
        </Table>
    );
}

function ExamRow(props){
    return(
        <>
            <tr>
                <td>{props.exam.code}</td>
                <td>{props.exam.score}</td>
                <td>{props.exam.date.format('YYYY-DD-MM')}</td>
                <td><ExamAction /></td>
            </tr>
        </>
    );
}

function ExamAction(props){
    return(
        <td><Button variant='danger'><i className="bi bi-trash3"></i></Button></td>
    );
}

export {ExamScores};