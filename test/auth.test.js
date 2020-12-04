let chai = require('chai')
let chaiHttp = require('chai-http')
let sever = require('../src/app')


chai.should()
chai.use(chaiHttp)

describe('Auth API', () =>{

    describe('Auth Login', () =>{
        it('Without password or username', (done) =>{
           chai.request(sever).post('/auth/login').end((err,response)=>{
               response.should.have.status(200)
               response.body.should.be.a('object')
               response.body.message.should.equal('Please type email , password')
               done();
           })
        })  
        it('Email wrong', (done) =>{
            let req ={
                email:'yah',
                password:'2313'
            }
            chai.request(sever).post('/auth/login').send(req).end((err,response)=>{
                response.should.have.status(200)
                response.body.message.should.equal('Please re-type email (example@xyz.com)')
                done();
            })
         })  

         it('Wrong password', (done) =>{
            let req ={
                email:'thanh@gmail.com',
                password:'2313'
            }
            chai.request(sever).post('/auth/login').send(req).end((err,response)=>{
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.message.should.equal('Wrong Password')
                done();
            })
         }) 
         it('Not found user', (done) =>{
            let req ={
                email:'thanh1@gmail.com',
                password:'2313'
            }
            chai.request(sever).post('/auth/login').send(req).end((err,response)=>{
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.message.should.equal('Not found user')
                done();
            })
         }) 

         it('Success', (done) =>{
            let req ={
                email:'thanh@gmail.com',
                password:'123456'
            }
            chai.request(sever).post('/auth/login').send(req).end((err,response)=>{
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.data.user._id.should.equal("SW0zcXjYAPLxaxAOBSa9")
                done();
            })
         }) 
    })  
})