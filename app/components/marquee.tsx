export default function Marquee() {
  const text = 'ENTREGA NA SUA REGIÃO   •   FRETE GRÁTIS ACIMA DE R$ 20,00   •   ENTREGA EM ATÉ 19 MINUTOS   •   BEBIDA GELADA NA SUA PORTA   •   OFERTAS EXCLUSIVAS TODO DIA   •   ';

  return (
    <div className="relative z-10 w-full overflow-hidden bg-[#F7B731] py-2">
      <div className="marquee-container-slow">
        <div className="marquee-content-slow">
          <span className="text-black font-bold text-sm md:text-base tracking-wide">{text}</span>
          <span className="text-black font-bold text-sm md:text-base tracking-wide">{text}</span>
        </div>
      </div>
    </div>
  );
}
