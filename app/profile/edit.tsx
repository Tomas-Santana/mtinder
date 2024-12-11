import { SimpleNavbar } from "@/components/app/simpleNavbar";
import mt from "@/style/mtWind";
import Animated, { SlideInRight, SlideOutLeft, LinearTransition } from "react-native-reanimated";
import { Pressable, View } from "react-native";
import { GlowingText, Text } from "@/components/ui/text";
import UserForm from "@/components/forms/updateUserForm";
import { VerticalTabs, Tab } from "@/components/ui/tabs";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { genres } from "@/constants/genres";
import { Button, CPushButton } from "@/components/ui/button";
import { useUser } from "@/hooks/app/useUser";
import { router } from "expo-router";

export default function UpdateInfoScreen() {
  const [currentUser, setCurrentUser] = useAtom(userAtom)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentUser?.favoriteGenres || [])
  const { updateUser } = useUser(currentUser || undefined, setCurrentUser)

  const handleSubmit = () => {
    console.log(firstName, lastName, selectedGenres)
    if(currentUser?._id) updateUser({ firstName: firstName|| currentUser.firstName, lastName: lastName || currentUser.lastName, genres: selectedGenres || currentUser.favoriteGenres })
    router.back()
  }

  return (
    <View style={[mt.flex1, mt.bg("gray", 900)]}>
      <View style={[mt.position("absolute"), mt.top(5), mt.left(5), mt.z(100)]}>
        <SimpleNavbar />
      </View>
      <View>

      </View>
      <VerticalTabs fill>
        <Tab name="Info">
          <View style={[mt.flex1, mt.justify("center"), mt.items("center"), mt.p(4)]}>
            <View style={[mt.flexCol, mt.justify("center"), mt.gap(4), mt.rounded("md"), mt.border(2), mt.borderColor("gray", 200), mt.glow("md", "blue"), mt.p(6), mt.bg("gray", 900)]}>
              <GlowingText style={[mt.fontSize("2xl"), mt.align("center"), mt.color("blue")]} color="#80E1FF">
                Tus datos personales
              </GlowingText>
              <Text style={[mt.fontSize("md"), mt.align("center"), mt.color("gray", 300)]}>
                Actualiza tus datos personales para ver información más precisa en tu app.
              </Text>
              <View style={[mt.mt(10)]}>
                <UserForm setFirstName={setFirstName} setLastName={setLastName} />
              </View>
            </View>
          </View>
        </Tab>
        <Tab name="Genres">
          {currentUser && (
            <View style={[mt.flex1, mt.justify("center"), mt.items("center"), mt.p(4)]}>
              <View style={[mt.flexCol, mt.justify("center"), mt.gap(4), mt.rounded("md"), mt.border(2), mt.borderColor("gray", 200), mt.glow("md", "blue"), mt.bg("gray", 800)]}>
                <GlowingText style={[mt.fontSize("2xl"), mt.align("center"), mt.color("blue")]} color="#80E1FF">
                  Tus géneros favoritos
                </GlowingText>
                <Text style={[mt.fontSize("md"), mt.align("center"), mt.color("gray", 300)]}>
                  Selecciona tus géneros favoritos para obtener recomendaciones personalizadas.
                </Text>
                
                <GenreTab 
                  user={currentUser}
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                />
              </View>
            </View>
          )}
        </Tab>
      </VerticalTabs>
      <View style={[mt.p(2)]}>
        <Button onPress={handleSubmit}>
          <Text>Upload</Text>
        </Button>
      </View>
    </View>
  )
}


interface GenreTabProps {
  user: User
  selectedGenres: string[]
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>
}

const GenreTab = ({ user, selectedGenres, setSelectedGenres }: GenreTabProps) => {
  function toggleGenre(genre: string): React.SetStateAction<string[]> {
    return (prev) =>
      prev.includes(genre)
        ? prev.filter((prevGenre) => prevGenre !== genre)
        : prev.length >= 5
        ? [genre, ...prev.slice(0, -1)]
        : [...prev, genre];
  }

  return (
    <View
      style={[
        mt.flexCol,
        mt.gap(2),
        mt.p(4),
        mt.justify("center"),
        mt.items("center"),
        mt.flex1,
        mt.w("full"),
      ]}
    >
      <Text style={[mt.color("white")]} size="md">
        Choose your favorite genres (up to 10)
      </Text>
      <View
        style={[
          mt.flexRow,
          mt.flexWrap,
          mt.w("full"),
          mt.flex1,
          mt.gap(2),
          mt.items("center"),
          
        ]}
      >
        {genres.map((genre) => (
          <CPushButton
            key={genre}
            onPress={() => {
              console.log(genre)
              setSelectedGenres(toggleGenre(genre));
            }}
            isPushed={selectedGenres.includes(genre)}
          >
            <Text>{genre}</Text>
          </CPushButton>
        ))}
      </View>

      <Pressable
        onPress={() => {
          setSelectedGenres([]);
        }}
      >
        <Text
          style={[mt.color("red")]} 
        >Clear</Text>
      </Pressable>
    </View>
  )
}