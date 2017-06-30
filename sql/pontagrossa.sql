-- Pedidos do mês
select s.createdat - interval 3 hour as pedido, c.name as cliente,'', 
s.amount as qtde, p.name as produto, s.unitvalue, s.value as total, timediff(s.finishedAt,s.createdAt ) as 'tempo',
v.code as 'voucher', v.value as  'desconto'
 from sale s left join prodreg pr on pr.id = s.prodreg left join zone z on z.id = pr.zone left join product p on p.id = pr.product
  left join voucher v on v.id = s.voucher
  left join user u on u.id = s.user left join costumer c on c.id = s.costumer
   where z.id ='499dfe43-7712-438d-85bf-888b98c7c717' -- Ponta Grossa
    and s.createdat - interval 3 HOUR > '2017-06'and s.createdat - interval 3 HOUR < '2017-07'
   order by s.createdat;

-- produtos mais vendidos Ponta Grossa
select p.name,sum(s.amount) 
	from sale s
	left join prodreg pr on pr.id = s.prodreg left join zone z on z.id = pr.zone left join product p on p.id = pr.product
	left join user u on u.id = s.user left join costumer c on c.id = s.costumer
	where z.active =true and z.id <>'d0d58281-81e4-410a-a8e7-16611cd5c96f' -- dev
	   and z.id ='499dfe43-7712-438d-85bf-888b98c7c717' 
 and  s.createdat - interval 3 HOUR > '2017-06' and s.createdat - interval 3 HOUR < '2017-07'
 group by p.id order by sum(s.amount) desc;

-- media notas ultimo mes
select avg(s.serviceRate) from sale s
 left join prodreg pr on pr.id = s.prodreg
  where pr.zone = '499dfe43-7712-438d-85bf-888b98c7c717'
   and s.createdAt - interval 3 hour > '2017-05' and s.createdAt - interval 3 hour < '2017-06'
  order by s.costumerComment desc;

-- media notas Mes anterior
select avg(s.serviceRate) from sale s
  left join prodreg pr on pr.id = s.prodreg
	where pr.zone = '499dfe43-7712-438d-85bf-888b98c7c717'
    and s.createdAt - interval 3 hour > '2017-04' and s.createdAt - interval 3 hour < '2017-05'
    order by s.costumerComment desc;

-- comentarios do ultimo mes
select s.serviceRate,  s.costumerComment from sale s
  left join prodreg pr on pr.id = s.prodreg
	where pr.zone = '499dfe43-7712-438d-85bf-888b98c7c717'
    and s.createdAt - interval 3 hour > '2017-05' and s.createdAt - interval 3 hour < '2017-06'
    order by s.costumerComment desc;

-- soma total de vendas
select  sum(s.value)
from sale s left join prodreg pr on pr.id = s.prodreg left join zone z on z.id = pr.zone left join product p on p.id = pr.product
  left join user u on u.id = s.user left join costumer c on c.id = s.costumer
   where z.id ='499dfe43-7712-438d-85bf-888b98c7c717' -- Ponta Grossa
    and s.createdat - interval 3 HOUR > '2017-02'and s.createdat - interval 3 HOUR < '2017-06'
   order by s.createdat;
