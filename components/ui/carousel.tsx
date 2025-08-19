import { ChevronLeft, ChevronRight } from "lucide-react-native"; // Or any icon lib
import React, { createContext, JSX, useContext, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import CarouselLib from "react-native-reanimated-carousel";
import { cn } from "../lib/utils";

type CarouselContextType = {
  scrollPrev: () => void;
  scrollNext: () => void;
  currentIndex: number;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within Carousel");
  return context;
};

interface CarouselProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => JSX.Element;
  vertical?: boolean;
  width: number;
  height: number;
  loop?: boolean;
  className?: string;
}

export const Carousel = ({
  data,
  renderItem,
  vertical = false,
  width,
  height,
  loop = false,
  className,
}: CarouselProps) => {
  const ref = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = () => {
    ref.current?.scrollTo({ index: currentIndex - 1, animated: true });
  };

  const scrollNext = () => {
    ref.current?.scrollTo({ index: currentIndex + 1, animated: true });
  };

  return (
    <CarouselContext.Provider value={{ scrollPrev, scrollNext, currentIndex }}>
      <View className={cn("relative", className)}>
        <CarouselLib
          ref={ref}
          width={width}
          height={height}
          data={data}
          vertical={vertical}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={renderItem}
          loop={loop}
        />
      </View>
    </CarouselContext.Provider>
  );
};
export const CarouselItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <View className={className}>{children}</View>;
};


export const CarouselPrevious = ({ className }: { className?: string }) => {
  const { scrollPrev } = useCarousel();
  return (
    <TouchableOpacity
      className={cn("absolute left-2 top-1/2 -translate-y-1/2", className)}
      onPress={scrollPrev}
    >
      <ChevronLeft size={20} />
    </TouchableOpacity>
  );
};

export const CarouselNext = ({ className }: { className?: string }) => {
  const { scrollNext } = useCarousel();
  return (
    <TouchableOpacity
      className={cn("absolute right-2 top-1/2 -translate-y-1/2", className)}
      onPress={scrollNext}
    >
      <ChevronRight size={20} />
    </TouchableOpacity>
  );
};