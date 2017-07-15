-- Vendas do mes anterior
select s.createdat - interval 4 hour as pedido,
c.name as cliente,
s.amount as qtde,
p.name as produto,
s.unitvalue,
s.value as total,
timediff(s.finishedAt,s.createdAt ) as 'tempo'
from sale s
left join prodreg pr on pr.id = s.prodreg
left join zone z on z.id = pr.zone
left join product p on p.id = pr.product
left join user u on u.id = s.user
left join costumer c on c.id = s.costumer

where z.active =true
  and z.id ='93ffc511-74cc-473b-a68e-276441d765fa' -- Campo Grande
 -- and z.id ='499dfe43-7712-438d-85bf-888b98c7c717' -- Ponta Grossa
  -- and z.id ='cc90e83f-124b-4ecb-95cf-3f39ca001c35' -- Dourados
  and s.createdat - interval 4 HOUR>DATE_FORMAT((now() - interval 1 month), "%Y-%m") and
  s.createdat - interval 4 HOUR < DATE_FORMAT(now(), "%Y-%m")
  order by s.createdat;

-- Top Produtos
select p.name,sum(s.amount) -- produtos mais vendidos cerveja.me
from sale s
left join prodreg pr on pr.id = s.prodreg
left join zone z on z.id = pr.zone
left join product p on p.id = pr.product
left join user u on u.id = s.user
left join costumer c on c.id = s.costumer
where z.active =true
	    and z.id <>'d0d58281-81e4-410a-a8e7-16611cd5c96f' -- dev
	   -- and z.id ='93ffc511-74cc-473b-a68e-276441d765fa' -- Campo Grande
	   -- and z.id ='499dfe43-7712-438d-85bf-888b98c7c717' -- Ponta Grossa
	   -- and z.id ='cc90e83f-124b-4ecb-95cf-3f39ca001c35' -- Dourados
-- and s.createdat - interval 4 HOUR>DATE_FORMAT((now() - interval 1 month), "%Y-%m") and
-- s.createdat - interval 4 HOUR < DATE_FORMAT(now(), "%Y-%m")
and  s.createdat - interval 4 HOUR > '2017-02'

	--  group by pr.id,z.id order by z.name,sum(s.amount) desc  -- individual
	 group by p.id order by sum(s.amount) desc    -- todas as cidades
   ;

   select avg(s.serviceRate) from sale s
   left join prodreg pr on pr.id = s.prodreg
   left join zone z on z.id = pr.zone
   where z.active =true
	   -- and z.id <>'d0d58281-81e4-410a-a8e7-16611cd5c96f' -- dev
	    and z.id ='93ffc511-74cc-473b-a68e-276441d765fa' -- Campo Grande
     and s.createdat - interval 4 HOUR>DATE_FORMAT((now() - interval 1 month), "%Y-%m") and
     s.createdat - interval 4 HOUR < DATE_FORMAT(now(), "%Y-%m")
-- and s.createdat - interval 4 HOUR>DATE_FORMAT((now() - interval 2 month), "%Y-%m") and
-- s.createdat - interval 4 HOUR < DATE_FORMAT((now() - interval 1 month), "%Y-%m")
;

select s.costumerRate,count(S.C s.serviceRate,s.costumerComment
  from sale s
  left join prodreg pr on pr.id = s.prodreg
  left join zone z on z.id = pr.zone
  where z.active =true
	   -- and z.id <>'d0d58281-81e4-410a-a8e7-16611cd5c96f' -- dev
	    and z.id ='93ffc511-74cc-473b-a68e-276441d765fa' -- Campo Grande
     and s.createdat - interval 4 HOUR>DATE_FORMAT((now() - interval 1 month), "%Y-%m") and
     s.createdat - interval 4 HOUR < DATE_FORMAT(now(), "%Y-%m")
     order by s.costumerComment desc;



     select z.name as cidade,c.name as cliente,(select count(o.costumer) from sale o group by o.costumer),c.createdat as cadastro,v.code,
     c.phone ,s.address as address, s.amount as qtde,p.name as produto, s.value,
     s.createdat - interval 2 hour as pedido,
     timediff(now(),s.createdat) as 'desde',
     timediff(s.aceptedAt,s.createdAt ) as 'aceito apos',
     timediff(s.onWayAt,s.createdAt ) as 'saiu para entrega',
     timediff(s.finishedAt,s.createdAt ) as 'tempo total do pedido',
     s.costumerRate as 'nota entregador',
     s.serviceRate as 'nota cliente',
     s.costumerComment as 'comentario cliente',
     u.name as entregador

     from sale s
     left join prodreg pr on pr.id = s.prodreg
     left join voucher v on v.id = s.voucher
     left join zone z on z.id = pr.zone
     left join product p on p.id = pr.product
     left join user u on u.id = s.user
     left join costumer c on c.id = s.costumer

     where z.active =true
     and s.createdat - interval 2 hour  >'2017-04-01 00:00:00'
     order by s.createdat desc
     limit 60;

     select s.costumer,count(*) from sale s group by s.costumer;


-- Pedidos do mês
select sum(s.unitvalue*s.amount) as 'total',
sum(s.value) as 'real',
count(s.voucher)*10 as 'voucher',
sum(s.unitvalue*s.amount)*0.1
from sale s left join prodreg pr on pr.id = s.prodreg left join zone z on z.id = pr.zone
left join product p on p.id = pr.product
left join user u on u.id = s.user left join costumer c on c.id = s.costumer
where z.id ='93ffc511-74cc-473b-a68e-276441d765fa'
and s.createdat - interval 4 HOUR > '2017-06'and s.createdat - interval 4 HOUR < '2017-07'
order by s.createdat;


   -- asdasd
