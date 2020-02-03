
import Assert from "../source/Common/Assert.js";
import API from "../source/Utility/API.js";
//const Assert = require("../source/Common/Assert.js").default;

describe('API Test', function() {

	beforeEach( function () 
	{
		// this.a = Assert(1).number.positive; //??
		//this.calculator = new Calculator();
		//??
		/*??*/
		/*?+*/
	});
  
	it('Test setting Command variables', function() 
	{
		const api = new API(`test`);
		const command = api.createCommand(`test`);
		command.describe(`API test description`);
		command.addParameter(`v`, `test parameter`, `string`, ``);
		command.setAction(() => 
		{
			console.log(this.describe);
		});
		command.register();

		API.request(`test`);  //??
      





		// console.log(this.calculator.add(Infinity, NaN));
		// console.log(this.calculator.add(2, 3));
  
		//expect(this.calculator.add(2, 2)).toBe(4);
	});
  
	it('should throw error when dividing by zero', function() {
		// var calculator = this.calculator;
  
		//expect(function() {
		//   calculator.divide(1, 0);
		//}).toThrow();
  
		// console.log(this.calculator.divide(2, 0));
		// console.log(this.calculator.divide(0, 2));
		//console.log(this.calculator.divide(2, -3));

	});
  
	it('should divide number', function() {
		// expect(this.calculator.divide(6, 2)).toBe(3);
	});
  
	it('should subtract positive numbers', function() {
		// expect(this.calculator.subtract(4, 2)).toBe(2);
	});
  
	it('should multiply numbers', function() {
		// expect(this.calculator.multiply(0, 3)).toBe(0);
		// expect(this.calculator.multiply(3, 0)).toBe(0);
	});
});
  
describe('calculator view', function() {
  
	beforeEach(function() {
		//$('body').append("<div id=\"calculator\"/>");
		// $('#calculator').html(calculatorTemplate);
		// initCalculator();
	});
  
	afterEach(function() {
		// $('#calculator').remove();
	});
  
	it('should add numbers', function() {
  
		//console.log(window.document.body.clientHeight);
  
		// $('#7').click();
		// $('#plus').click();
		// $('#9').click();
		// $('#eval').click();
  
		// expect($('.screen').text()).toBe('16');
	});
  
	it('should divide numbers', function() {
		//$('#6').click();
		// $('#divide').click();
		// $('#3').click();
		//$('#eval').click();
  
		//expect($('.screen').text()).toBe('2');
	});
  
	it('should multiply numbers', function() {
		/*
      $('#7').click();
      $('#multiply').click();
      $('#8').click();
      $('#eval').click();
  
      expect($('.screen').text()).toBe('56');*/
	});
  
	it('should subtract numbers', function() {
		/*
      $('#7').click();
      $('#minus').click();
      $('#8').click();
      $('#eval').click();
  
      expect($('.screen').text()).toBe('-1');
      */
	});
});
  